class NextManager {
    #next

    setNext(next) {
        this.#next = next;
    }

    throw(error) {
        if (!this.#next) {
            console.log('NextManager not have next');
            return;
        }
        this.#next(error);
    }
}

module.exports = {
    NextManager
}