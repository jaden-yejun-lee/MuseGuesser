const { QuestionSet } = require('../utility/questionSet');

describe("QuestionSet Class Tests", () => {
    beforeEach(() => {
        QuestionSet.QID = 0; // reset static counter before each execution
    });

    test("should correctly initialize with tracks and a correct answer", () => {
        const tracks = [
            { name: "Song 1", artists: [{ name: "Artist 1" }], preview_url: "url1" },
            { name: "Song 2", artists: [{ name: "Artist 2" }], preview_url: "url2" },
            { name: "Song 3", artists: [{ name: "Artist 3" }], preview_url: "url3" },
        ];
        const correctIndex = 1;

        const questionSet = new QuestionSet(tracks, correctIndex);

        expect(questionSet.id).toBe(0);             // starts with ID 0
        expect(questionSet.options).toEqual([
            { name: "Song 1", artist: "Artist 1" },
            { name: "Song 2", artist: "Artist 2" },
            { name: "Song 3", artist: "Artist 3" },
        ]);
        expect(questionSet.correct).toBe(correctIndex);
        expect(questionSet.url).toBe("url2");
    });

    test("should increment QID for each new instance", () => {
        const tracks = [
            { name: "Song 1", artists: [{ name: "Artist 1" }], preview_url: "url1" },
        ];

        const questionSet1 = new QuestionSet(tracks, 0);
        const questionSet2 = new QuestionSet(tracks, 0);

        expect(questionSet1.id).toBe(0);
        expect(questionSet2.id).toBe(1);
    });

    test("should correctly identify the correct choice", () => {
        const tracks = [
            { name: "Song 1", artists: [{ name: "Artist 1" }], preview_url: "url1" },
            { name: "Song 2", artists: [{ name: "Artist 2" }], preview_url: "url2" },
        ];
        const correctIndex = 0;

        const questionSet = new QuestionSet(tracks, correctIndex);

        expect(questionSet.isCorrect(0)).toBe(true);    // correct choice
        expect(questionSet.isCorrect(1)).toBe(false);   // incorrect choice
    });

    test("should correctly initialize with tracks having only one artist", () => {
        const tracks = [
            { name: "Song 1", artists: [{ name: "Artist 1" }], preview_url: "url1" },
        ];
        const correctIndex = 0;

        const questionSet = new QuestionSet(tracks, correctIndex);

        expect(questionSet.options).toEqual([{ name: "Song 1", artist: "Artist 1" }]);
    });
});
