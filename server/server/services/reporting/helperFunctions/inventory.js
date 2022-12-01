function inventory () {
    const allowedSizes = [
        '88x31', '120x20', '120x30', '120x60', '120x90', '120x240', '120x600', '125x125', '160x600', 
        '168x28', '168x42', '180x150', '200x200', '200x446', '216x36', '216x54', '220x90', '234x60', '240x133', '240x400', 
        '250x250', '250x350', '250x360', '250x400', '292x30', '300x31', '300x50', '300x75', '300x100', '300x250', '300x450', 
        '300x600', '300x1050', '320x50', '320x100', '320x480', '336x280', '468x60', '480x320', '580x250', '580x400', '728x90', 
        '750x100', '750x200', '750x300', '768x1024', '930x180', '950x90', '960x90', '970x66', '970x90', '970x250', '980x90', 
        '980x120', '1024x768', '1060x90', '970x200', '640x480', '640x400',
        '580x450', '512x288', '430x288', '300x300', '1x1', '1x0', '2x0', '3x0', '4x0'
    ]

    function getAllowedSizes() {
        return allowedSizes;
    }

    return Object.freeze({
        getAllowedSizes
    })
}

module.exports = {
    inventory: inventory()
}

