/**
 * Pool data structures allow for unused element to be used again when a new value
 * is asked for.
 */
export class Pool<T> {
    #used_elements: T[];
    #unused_elements: T[];

    constructor() {
        this.#used_elements = [];
        this.#unused_elements = [];  
    }

    add_element(element: T) {
        this.#used_elements.push(element);
    }

    /**
     * If element is in the pool, remove it.
     * @param element
     * @returns true if an element was deleted and false otherwise.
     */
    remove_element(element: T): boolean {
        for(let i = 0; i < this.#used_elements.length; i++) {
            if(this.#used_elements[i] === element) {
                this.#unused_elements.push(this.#used_elements[i]);
                this.#used_elements.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    /**
     * Gets a random unused element.
     * @returns 
     */
    get_unused(): T | undefined { return this.#unused_elements.pop(); }

    /**
     * Returns true if there are unused elements.
     * @returns
     */
    has_unused(): boolean { return this.#unused_elements.length != 0; }

    get elements() : T[] { return this.#used_elements}
    get count(): number { return this.#used_elements.length; }
}