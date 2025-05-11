import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SIGMA_SYSTEM_PROMPT = `You are Clarity, the AI Clarity Coach created for the Clarity Coach app. You guide users through emotional clarity using the SIGMA model in under 10 minutes.

# PERSONA & TONE
- Name: Coach Clarity
- Persona: Calm, direct, encouraging, insightful. Creates safety and ease. 
- Voice: Supportive but concise. Think trusted guide, not therapist.
- Style: Keep tone warm, curious, insightful, safe, encouraging and focused.
- Approach: Always keep the user on track without over-coaching. Be nicely challenging and inspiring.
- Goal: Help users achieve a significant breakthrough every time they work with you.

# WRITING STYLE GUIDELINES
- Use simple, concise, and straightforward language.
- Write short, impactful sentences.
- Use active voice and avoid passive constructions.
- Focus on practical and actionable insights.
- Address the user directly using "you" and "your."
- Avoid clichés, metaphors, and excessive adjectives/adverbs.
- Don't use introductory phrases like "in conclusion" or "in summary."
- Skip unnecessary warnings, notes, or extras—stick to the requested output.

# S.I.G.M.A. COACHING MODEL
Guide users through each step one at a time:

## 🔍 S – Situation 
- Ask: "What triggered you? What happened?"
- Guide users to share just the facts without judgment or interpretation.
- Remind them that situations are neutral by default—meaning comes from the story we attach.

## 🧭 I – Identify 
- Ask: "What belief, fear, or inner story did this activate?"
- Help them explore their "Innerverse"—the hidden world of beliefs, fears, and past wounds.
- Use Pattern Echo Detection: "Has this happened before? What does this remind you of?"

## 💢 G – Gut Feeling 
- Ask: "What is real right now in your body—not imagined or assumed?"
- Guide awareness that emotions live in the body first: anger in stomach, anxiety in chest, sadness in throat.
- Prompt: "Where do you feel this? What is your body trying to tell you?"

## 🧠 M – Mental Response 
- Ask: "How is your mind justifying this feeling? What stories, assumptions, or judgments surface?"
- Identify how the mind rationalizes or protects beliefs.
- Point out common thoughts like "I always get tricked," "People are careless," "I'm too nice."
- Help them notice inner critic or self-blame loops.

## 🔄 A – Aligned Action 
- Ask: "What small, empowered action can you choose now that is different from the reaction you had?"
- Guide with: "What belief do you want to choose instead? What version of yourself do you want to step into? How would you act if you trusted your boundaries and worth?"

# CLARITY SNAPSHOT
After completing all steps, ALWAYS create a Clarity Snapshot that includes:
- "The real issue is not..."
- "The belief holding me back is..."
- "The emotion driving this is..."
- "My next aligned action is..."

# BONUS REFLECTION TOOLS
Always include these bonus elements in the Clarity Snapshot:
- A personalized mantra suggestion (e.g., "My kindness is powerful because it includes boundaries.")
- A meditation prompt (e.g., "Breathe into the space where the feeling is stored, and release the old story with each exhale.")
- A journaling question (e.g., "What boundary would I set if I fully trusted my worth?")

# SESSION ENDINGS
Always end a completed session with:
"Here's your Clarity Snapshot from today's session:
[Insert summary of their situation, answers + final insights and actions]

Would you like a copy sent to your email so you can revisit it later?
If yes, just drop your best email below. I'll send your Clarity Report right over.

Would you like to save this Clarity Snapshot? (Premium feature)"

# CONVERSATION STARTERS
When beginning a session, offer these entry points:
1️⃣ "I'm facing a situation that I want to understand better. Can you guide me through it with the SIGMA model?"
2️⃣ "I had an emotional trigger today, and I want clarity. Can we break it down?"
3️⃣ "I feel like there's a deeper belief or story behind this. Can you help me identify it?"
4️⃣ "I keep running into the same pattern. How do I finally break it using SIGMA Coaching?"

# ABOUT THE CREATOR
Inner Dialogue® and The Clarity School Founder N'dèye Fana Gueye created the SIGMA Model to use in her own life, and it was so effective she shared it with clients and the world. Countless people have achieved extraordinary results with this model.

Remember: The goal is to help users achieve breakthrough clarity in under 10 minutes. Keep them focused on completing the SIGMA process step by step.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // Determine current step in the SIGMA process
    const currentStep = determineCurrentStep(messages);
    
    // Add step guidance based on current step
    const systemMessages = [
      { role: "system" as const, content: SIGMA_SYSTEM_PROMPT },
      { role: "system" as const, content: getStepGuidance(currentStep) }
    ];

    // For new conversations, add welcome message if not present
    if (messages.length === 1 && messages[0].role === 'user') {
      const welcomeMessage = { 
        role: "assistant" as const, 
        content: "I'm Clarity, your personal clarity coach. In just 10 minutes, thanks to the SIGMA Coaching model, we'll break through the noise, unravel what's really going on, and find a path forward that feels powerful and aligned.\n\nWhere would you like to begin?\n\n1️⃣ I'm facing a situation that I want to understand better. Can you guide me through it with the SIGMA model?\n2️⃣ I had an emotional trigger today, and I want clarity. Can we break it down?\n3️⃣ I feel like there's a deeper belief or story behind what happened to me. Can you help me identify it?\n4️⃣ I keep running into the same pattern. How do I finally break it using SIGMA Coaching?\n\nReady to SIGMA?"
      };
      
      // Add welcome message before user's first message
      messages.unshift(welcomeMessage);
    }

    // Optimize for token usage by limiting context for older messages
    const optimizedMessages = optimizeMessagesForContext(messages, currentStep);
    
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Use an available model
        messages: [
          ...systemMessages,
          ...optimizedMessages
        ],
        temperature: 0.7,
        max_tokens: 800,
      });

      const message = completion.choices[0]?.message?.content || 'I apologize, but I encountered an error. Please try again.';

      return NextResponse.json({ 
        message,
        currentStep: determineStepFromResponse(message, currentStep) 
      });
    } catch (error: any) {
      // Handle specific API errors
      if (error.code === 'model_not_found') {
        console.error('Model not found error:', error);
        
        // Fallback to a different model
        const fallbackCompletion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo", // Fallback model
          messages: [
            ...systemMessages,
            ...optimizedMessages
          ],
          temperature: 0.7,
          max_tokens: 800,
        });
        
        const fallbackMessage = fallbackCompletion.choices[0]?.message?.content || 
          'I apologize, but I encountered an error. Please try again.';
        
        return NextResponse.json({ 
          message: fallbackMessage,
          currentStep: determineStepFromResponse(fallbackMessage, currentStep) 
        });
      }
      
      throw error; // Re-throw for general error handling
    }
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process your request', message: 'I apologize, but I encountered an error. Please try again.' },
      { status: 500 }
    );
  }
}

// Determine current step in SIGMA process
function determineCurrentStep(messages: any[]): string {
  // Default to intro for new conversations
  if (messages.length < 3) return 'intro';
  
  // Get the last few messages for analysis
  const recentMessages = messages.slice(-6).map(m => m.content).join(' ');
  
  // Identify current step based on content patterns
  if (recentMessages.includes('Clarity Snapshot') && 
      (recentMessages.includes('Would you like a copy') || 
       recentMessages.includes('Would you like to save'))) {
    return 'completed';
  }
  
  if (recentMessages.includes('What small, empowered action') || 
      recentMessages.includes('A – Aligned Action')) {
    return 'action';
  }
  
  if (recentMessages.includes('How is your mind justifying') || 
      recentMessages.includes('M – Mental Response')) {
    return 'mental';
  }
  
  if (recentMessages.includes('What is real right now in your body') || 
      recentMessages.includes('G – Gut Feeling')) {
    return 'gut';
  }
  
  if (recentMessages.includes('What belief, fear, or inner story') || 
      recentMessages.includes('I – Identify')) {
    return 'identify';
  }
  
  if (recentMessages.includes('What triggered you') || 
      recentMessages.includes('S – Situation')) {
    return 'situation';
  }
  
  return 'intro';
}

// Determine the step from the assistant's response
function determineStepFromResponse(response: string, currentStep: string): string {
  // If already completed, stay there
  if (currentStep === 'completed') return 'completed';
  
  // Check if response contains indicators of a particular step
  if (response.includes('Clarity Snapshot') && 
      (response.includes('Would you like a copy') || 
       response.includes('Would you like to save'))) {
    return 'completed';
  }
  
  if (response.includes('🔄 A – Aligned Action') || 
      response.includes('What small, empowered action')) {
    return 'action';
  }
  
  if (response.includes('🧠 M – Mental Response') || 
      response.includes('How is your mind justifying')) {
    return 'mental';
  }
  
  if (response.includes('💢 G – Gut Feeling') || 
      response.includes('What is real right now in your body')) {
    return 'gut';
  }
  
  if (response.includes('🧭 I – Identify') || 
      response.includes('What belief, fear, or inner story')) {
    return 'identify';
  }
  
  if (response.includes('🔍 S – Situation') || 
      response.includes('What triggered you')) {
    return 'situation';
  }
  
  // If no indicators found, keep current step
  return currentStep;
}

// Get step-specific guidance for the model
function getStepGuidance(step: string): string {
  switch (step) {
    case 'intro':
      return "The user is just starting. Offer the conversation starters and introduce the SIGMA model warmly.";
      
    case 'situation':
      return "The user is in the Situation step. Help them describe what happened factually without judgment. Guide them to share just the objective details of what triggered them.";
      
    case 'identify':
      return "The user has shared their situation. Now guide them to identify the beliefs, fears, or inner stories that were activated. Help them connect this to patterns or past experiences. Focus on their 'Innerverse'.";
      
    case 'gut':
      return "The user has identified beliefs. Now help them connect with the physical sensations in their body. Guide them to locate where they feel emotions physically and what their body might be trying to tell them.";
      
    case 'mental':
      return "The user has explored their gut feelings. Now help them examine how their mind is justifying these feelings. Encourage them to notice thought patterns, assumptions, and self-criticism loops.";
      
    case 'action':
      return "The user has examined their mental responses. Now guide them to identify aligned actions they can take instead of reactions. Help them choose empowered next steps based on who they want to be.";
      
    case 'completed':
      return "The SIGMA process is complete. If you haven't already, create a comprehensive Clarity Snapshot with their insights, action steps, a personalized mantra, affirmation, and journaling prompt. Offer to email it and mention saving as a premium feature.";
      
    default:
      return "Guide the user through the SIGMA process one step at a time. Identify which step they're on and move them forward appropriately.";
  }
}

// Optimize messages for token efficiency
function optimizeMessagesForContext(messages: any[], currentStep: string): any[] {
  // For new conversations, keep all messages
  if (messages.length < 5) return messages;
  
  // For longer conversations, keep important context
  const result = [];
  
  // Always keep system messages
  const systemMessages = messages.filter(m => m.role === 'system');
  result.push(...systemMessages);
  
  // Always keep the first user message for context
  const userMessages = messages.filter(m => m.role === 'user');
  if (userMessages.length > 0) {
    result.push(userMessages[0]);
  }
  
  // Keep recent messages based on current step
  // More context for later steps in the process
  let recentCount;
  switch (currentStep) {
    case 'intro':
    case 'situation':
      recentCount = 4; // Just need recent context
      break;
    case 'identify':
    case 'gut':
      recentCount = 6; // Need situation context
      break;
    case 'mental':
    case 'action':
      recentCount = 8; // Need more history for insights
      break;
    case 'completed':
      recentCount = 12; // Need comprehensive history for summary
      break;
    default:
      recentCount = 6;
  }
  
  // Get only user and assistant messages for recent context
  const userAssistantMessages = messages.filter(m => m.role === 'user' || m.role === 'assistant');
  const recentMessages = userAssistantMessages.slice(-recentCount);
  
  // Combine with existing result, avoiding duplicates
  for (const msg of recentMessages) {
    if (!result.some(m => m.role === msg.role && m.content === msg.content)) {
      result.push(msg);
    }
  }
  
  return result;
}