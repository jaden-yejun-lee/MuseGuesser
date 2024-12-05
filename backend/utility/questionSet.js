class QuestionSet { // Class for multiple-choice with one answer
    static QID = 0  // unique identifier

    constructor(tracks, correct) {
        this.id = QuestionSet.QID++

        this.options = tracks.map((track) => {
            return {
                name: track.name,
                artist: track.artists[0].name
            }
        })

        this.correct = correct
        this.url = tracks[correct].preview_url  // url
    }

    // If choice is correct
    isCorrect(choice) {
        return choice == this.correct
    }
}

module.exports = {
    QuestionSet
}