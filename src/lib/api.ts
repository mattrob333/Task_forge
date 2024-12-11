import OpenAI from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // API key should be in .env file
  dangerouslyAllowBrowser: true // Note: In production, you should use a backend to make API calls
});

export const api = {
  async generateTasks(prompt: string) {
    try {
      const formattedPrompt = `Please categorize the following text into tasks:\n${prompt}\n\nFor each task, please provide the following details in this format:
Task 1: Task Title (e.g., "Create Social Media Campaign") | Brief Description (e.g., "Plan and execute a social media campaign") | Department (e.g., "Marketing") | Role (e.g., "Social Media Manager") | Expertise (e.g., "SEO")
Task 2: Task Title (e.g., "Design New Logo") | Brief Description (e.g., "Design a new logo for our brand") | Department (e.g., "Design") | Role (e.g., "Graphic Designer") | Expertise (e.g., "Graphic Design")
...and so on.

Important: Make sure to format each task exactly as shown above, with the pipe symbol | separating each field.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a task organization assistant that helps break down and categorize tasks. Always respond in the exact format requested, using the pipe symbol | to separate fields."
          },
          {
            role: "user",
            content: formattedPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      if (!response.choices || response.choices.length === 0) {
        throw new Error('Invalid API response');
      }

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating tasks:', error);
      throw error;
    }
  },

  async generateActionItems(tasks: string, editEntry: string = '') {
    try {
      const prompt = `Given the following tasks, please break each one down into detailed action items:\n${tasks}\n\n${editEntry}`;
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a task breakdown assistant that helps create detailed action items for tasks. For each task, provide a clear list of sequential steps or subtasks that need to be completed."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      if (!response.choices || response.choices.length === 0) {
        throw new Error('Invalid API response');
      }

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating action items:', error);
      throw error;
    }
  }
};