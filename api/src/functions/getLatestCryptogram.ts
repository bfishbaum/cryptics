import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { DatabaseService } from '../database';

export async function getLatestCryptogram(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('HTTP trigger function processed a request.');

    try {
        const cryptogram = await DatabaseService.getLatestCryptogram();
        if (!cryptogram) {
            return {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ error: 'No cryptograms found' })
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
        context.log('Error fetching latest cryptogram:', error);
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

app.http('getLatestCryptogram', {
    methods: ['GET', 'OPTIONS'],
    authLevel: 'anonymous',
    route: 'cryptograms/latest',
    handler: getLatestCryptogram
});