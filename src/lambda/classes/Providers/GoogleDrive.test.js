import GoogleDrive from './GoogleDrive';

describe('GoogleDrive', () => {
    it('"regex" must be correct.', () => {
        expect(GoogleDrive.getVideoId('https://drive.google.com/file/d/5p_qEW432qT5_EWQjwTo-Q5FaEjjsWUvc/view')).toBe('5p_qEW432qT5_EWQjwTo-Q5FaEjjsWUvc');
        expect(GoogleDrive.getVideoId('https://drive.google.com/open?id=5p_qEW432qT5_EWQjwTo-Q5FaEjjsWUvc')).toBe('5p_qEW432qT5_EWQjwTo-Q5FaEjjsWUvc');
        expect(GoogleDrive.getVideoId('https://docs.google.com/presentation/d/5p_qEW432qT5_EWQjwTo-Q5FaEjjsWUvc/edit?usp=sharing')).toBe('5p_qEW432qT5_EWQjwTo-Q5FaEjjsWUvc');
    });

    it('all methods must work.', () => {
        const url = 'https://drive.google.com/file/d/5p_qEW432qT5_EWQjwTo-Q5FaEjjsWUvc/view';
        const video = new GoogleDrive(url);

        // static methods
        expect(GoogleDrive.check(url)).toBe(true);

        // instance methods
        expect(video.getId()).toBe('5p_qEW432qT5_EWQjwTo-Q5FaEjjsWUvc');
        expect(video.providerName).toBe('google-drive');
        expect(video.url).toBe(url);
    });
});
