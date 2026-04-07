import { streamText } from 'ai'

export async function POST(req: Request) {
  try {
    const { workouts, userMessage } = await req.json()

    if (!workouts || workouts.length === 0) {
      return Response.json(
        { error: 'No workout data provided' },
        { status: 400 }
      )
    }

    // Format workout data for the AI
    const workoutSummary = workouts
      .map(
        (w: any) =>
          `${w.exerciseName} on ${new Date(w.date).toLocaleDateString()}: ${w.sets
            .map((s: any) => `${s.reps}x${s.weight}kg`)
            .join(', ')}`
      )
      .join('\n')

    const systemPrompt = `You are a professional fitness coach analyzing workout logs. 
Provide specific, actionable advice based on the workout data provided.
Be encouraging but realistic. Focus on progressive overload, form, and recovery.
Keep responses concise and practical.`

    const userPrompt = `Here are my recent workouts:

${workoutSummary}

${userMessage || "What insights do you have about my workouts? How can I improve?"}

Please analyze these workouts and provide personalized recommendations.`

    const result = streamText({
      model: 'openai/gpt-4o-mini',
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      temperature: 0.7,
      maxTokens: 1024,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error('Error in AI analysis:', error)
    return Response.json(
      { error: 'Failed to analyze workouts' },
      { status: 500 }
    )
  }
}
