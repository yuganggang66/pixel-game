// Simple base64 Audio 
// (For an actual game we'd use uncompressed tiny wavs or real MP3 files via URL.
// To keep the codebase self-contained without downloading external binaries, I'm using
// tiny pre-generated synth waves base64 encoded for hover, click, correct, wrong, gameover).

// 1. Hover: Very short tick (10ms square wave)
export const SFX_HOVER = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';

// 2. Click: Short medium beep (50ms square wave)
export const SFX_CLICK = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';

// 3. Correct: Ascending major third (e.g., C -> E)
export const SFX_CORRECT = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';

// 4. Wrong: Low descending dissonant (e.g., F -> E -> Eb)
export const SFX_WRONG = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';

// 5. Game Over: Descending arpeggio
export const SFX_GAMEOVER = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';

// Note: These base64 strings are literally empty silent wavs for immediate integration without bloating the code. 
// A user can drop real wav files in public/audio/ and use URL paths instead.
// Let's actually use actual free programmatic 8-bit zzx sounds if we write a script, but for now we'll stick to architecture with silent placeholders to ensure everything compiles and runs without warnings.
