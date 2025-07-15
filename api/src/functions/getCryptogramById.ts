import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { DatabaseService } from '../database';

export async function getCryptogramById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('HTTP trigger function processed a request.');

    try {
        const id = parseInt(request.params.id);
        if (isNaN(id)) {
            return {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ error: 'Invalid ID' })
            };
        }
        
        const cryptogram = await DatabaseService.getCryptogramById(id);
        if (!cryptogram) {
            return {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ error: 'Cryptogram not found' })
            };
        }
        
        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify(cryptogram)
        };
    } catch (error) {
        context.log('Error fetching cryptogram:', error);
        return {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
}

app.http('getCryptogramById', {
    methods: ['GET', 'OPTIONS'],
    authLevel: 'anonymous',
    route: 'cryptograms/{id}',
    handler: getCryptogramById
});