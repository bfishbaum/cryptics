import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { DatabaseService } from '../database';

export async function getPaginatedCryptograms(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('HTTP trigger function processed a request.');

    try {
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '20');
        
        const cryptograms = await DatabaseService.getLatestCryptograms(page, limit);
        
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
        context.log('Error fetching paginated cryptograms:', error);
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

app.http('getPaginatedCryptograms', {
    methods: ['GET', 'OPTIONS'],
    authLevel: 'anonymous',
    route: 'cryptograms/paginated',
    handler: getPaginatedCryptograms
});