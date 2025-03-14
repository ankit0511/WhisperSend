import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(request: Request) {
  console.log('Request received'); // Log when the request is received

  try {
    // Parse the request body
    const { prompt } = await request.json();
    console.log('Prompt:', prompt); // Log the prompt

    // Stream the text response
    const result = await streamText({
      model: openai('gpt-4'),
      prompt, // Use the prompt from the request body
    });

    console.log('Streaming response...',result); // Log before returning the response

    // Return the streamed response
    return new Response(result, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    // Handle errors
    console.error('Error:', error); // Log the error
    return new Response('An error occurred while processing your request.', {
      status: 500,
    });
  }
}