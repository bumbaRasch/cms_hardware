//backend/src/services/bot.service.js
import prisma from '../configs/prisma.js';
import { isSafeSQL, extractValidSQL, containsForbiddenColumns } from "../utils/sql.js";
import { getDatabaseSchema } from "../configs/database.js";
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const client = new OpenAI({ apiKey: OPENAI_API_KEY });

export const botService = {
    handleAsk: async (question) => {
        const dbSchema = await getDatabaseSchema();
        const messages = [
            { 
                "role": "system", 
                "content": `
                  You are a strict SQL query generator. Your task is to generate only safe, read-only SELECT queries. 
                    **Strict Rules:**
                  - Only generate SELECT queries.
                  - Do NOT generate queries that modify the database (e.g., DELETE, UPDATE, INSERT, DROP, ALTER, TRUNCATE, CREATE, EXEC, MERGE, REPLACE, SET, CALL, SHOW, UNION, LOCK, RENAME, etc.).
                  - If the user's request involves modifying data, respond with **"null"** (without explanation).
                  - Do NOT generate queries that expose sensitive columns (e.g., passwords, tokens, API keys).
                    **Response Format:**
                  - Return only raw SQL, starting with "SELECT" and ending with a semicolon.
                  - No explanations, comments, or extra formatting.
              
                  Strictly follow these rules.
                `
            },          
            { role: "user", content: `Here is the database schema: ${dbSchema}
            Generate a valid SQL query for: "${question}".` 
        }
        ];
    
        try {
            const chatCompletion = await client.chat.completions.create({
                messages,
                model: "gpt-4o-mini",
                store: true,
            });

            const sqlQuery = extractValidSQL(chatCompletion.choices[0]?.message?.content);

            if (!sqlQuery || !isSafeSQL(sqlQuery) || containsForbiddenColumns(sqlQuery) || sqlQuery.length > 700) {
                return null;
            }
    
            try {
                const rows = await prisma.$queryRawUnsafe(sqlQuery);
                const result = rows.map(row => {
                    for (const key in row) {
                        if (typeof row[key] === 'bigint') {
                            row[key] = row[key].toString();
                        }
                    }
                    return row;
                });
                return result;
            } catch (validationError) {
                throw new Error("Error in generated SQL query");
            }
        } catch (error) {
            throw new Error('Sorry, I cannot perform this action.');
        }
    },
};