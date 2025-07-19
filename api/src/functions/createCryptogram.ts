import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { DatabaseService, CryptogramInput } from '../database';

export async function createCryptogram(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('HTTP trigger function processed a request.');

    try {
        const cryptogramData: CryptogramInput = await request.json() as CryptogramInput;
        
        // Basic validation
        if (!cryptogramData.puzzle || !cryptogramData.solution) {
            return {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ error: 'Puzzle and solution are required' })
            };
        }
        
        const cryptogram = await DatabaseService.createCryptogram(cryptogramData);
        
        return {
            status: 201,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify(cryptogram)
        };
    } catch (error) {
        context.log('Error creating cryptogram:', error);
        return {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ 
                error: 'Internal server error',
                details: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined
            })
        };
    }
}

app.http('createCryptogram', {
    methods: ['POST', 'OPTIONS'],
    authLevel: 'anonymous',
    route: 'cryptograms',
    handler: createCryptogram
});