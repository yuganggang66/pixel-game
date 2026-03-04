export interface Option {
    key: string;
    value: string;
}

export interface Question {
    id: string | number;
    question: string;
    options: Option[];
    answer: string;
}

interface ScorePayload {
    id: string;
    score: number;
    timestamp: string;
}

const GAS_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;

// Mock data generator for fallback
const getMockQuestions = (count: number): Question[] => {
    const mockOptions = [
        { key: 'A', value: 'JavaScript' },
        { key: 'B', value: 'Python' },
        { key: 'C', value: 'Java' },
        { key: 'D', value: 'C++' }
    ];

    return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        question: `这是测试问题 ${i + 1}：目前最热门的前端程式语言是？`,
        options: mockOptions,
        answer: 'A'
    }));
};

export const fetchQuestions = async (count: number): Promise<Question[]> => {
    // Use mock data if no GAS URL is provided
    if (!GAS_URL || GAS_URL === 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec') {
        console.log('Using mock questions (No valid GAS URL configured)');
        return new Promise(resolve => setTimeout(() => resolve(getMockQuestions(count)), 1000));
    }

    try {
        const response = await fetch(`${GAS_URL}?count=${count}`);
        const result = await response.json();

        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Failed to fetch questions:', error);
        // Fallback to mock on error
        return getMockQuestions(count);
    }
};

export const submitScore = async (payload: ScorePayload): Promise<boolean> => {
    if (!GAS_URL || GAS_URL === 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec') {
        console.log('Mock score submitted:', payload);
        return new Promise(resolve => setTimeout(() => resolve(true), 1000));
    }

    try {
        const response = await fetch(GAS_URL, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            }
        });

        // GAS always returns a redirect for POST, fetch follows it automatically
        // The final response might be HTML or JSON depending on GAS config
        const result = await response.json().catch(() => ({ success: true }));
        return result.success !== false;
    } catch (error) {
        console.error('Failed to submit score:', error);
        return false;
    }
};
