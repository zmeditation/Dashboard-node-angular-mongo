const is_hb = [
    {name: "hb", value: "1"},
    {name: "rtb", value: "0"}
]

class IsHbFilter {
    constructor() {
    }

    run() {
        return {
            success: true,
            name: 'IS_HB',
            results: is_hb,
        }
    }
}

module.exports = IsHbFilter;
