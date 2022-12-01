class RtbSizes {
    constructor() {
    }

    run() {
        return {
            success: true,
            name: 'SIZES',
            results: [
                "336x280",
                "468x60",
                "120x600",
                "970x90",
                "300x250",
                "970x250",
                "240x400",
                "320x100",
                "728x90",
                "320x50",
                "160x600",
                "300x600"
            ].sort()
        }
    }
}

module.exports = RtbSizes;
