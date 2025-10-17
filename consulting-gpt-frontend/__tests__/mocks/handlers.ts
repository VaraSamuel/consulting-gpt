// MSW handlers for mocking API endpoints
import { http, HttpResponse } from 'msw';

// Mock handlers for API endpoints
export const handlers = [
  // Mock technology creation endpoint
  http.post('/api/v1/technologies', async ({ request }) => {
    const body = (await request.json()) as any;

    // Simulate successful technology creation
    return HttpResponse.json(
      {
        id: 1,
        name: body?.name || 'Default Technology',
        abstract: body?.abstract || 'Default abstract',
        num_of_axes: body?.num_of_axes || 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { status: 201 }
    );
  }),

  // Mock technology retrieval endpoint
  http.get('/api/v1/technologies/:id', ({ params }) => {
    const { id } = params;

    return HttpResponse.json({
      id: Number(id),
      name: 'AI Medical Diagnostic System',
      abstract: 'A comprehensive AI-powered medical diagnostic system.',
      num_of_axes: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }),

  // Mock related technologies endpoint
  http.get('/api/v1/technologies/:id/related', ({ params }) => {
    const { id } = params;

    return HttpResponse.json([
      {
        id: 2,
        name: 'Related Technology 1',
        abstract: 'Related technology description',
        similarity_score: 0.85,
      },
      {
        id: 3,
        name: 'Related Technology 2',
        abstract: 'Another related technology',
        similarity_score: 0.78,
      },
    ]);
  }),
];
