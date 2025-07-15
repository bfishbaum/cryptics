import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { DatabaseService } from '../database';

export async function getCryptograms(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('HTTP trigger function processed a request.');

    try {
        const cryptograms = await DatabaseService.getAllCryptograms();
        
        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify(cryptograms)
        };
    } catch (error) {
        context.log('Error fetching cryptograms:', error);
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

app.http('getCryptograms', {
    methods: ['GET', 'OPTIONS'],
    authLevel: 'anonymous',
    route: 'cryptograms',
    handler: getCryptograms
});