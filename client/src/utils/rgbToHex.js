export const rgbToHex = (color) => {
    color = "" + color;
    if (!color || color.indexOf("rgb") < 0) {
        return;
    }

    if (color.charAt(0) === "#") {
        return color;
    }

    var nums = /(.*?)rgb\((\d+),\s*(\d+),\s*(\d+)\)/i.exec(color),
        r = parseInt(nums[2], 10).toString(16),
        g = parseInt(nums[3], 10).toString(16),
        b = parseInt(nums[4], 10).toString(16);

    return "#" + (
        (r.length === 1 ? "0" + r : r) +
        (g.length === 1 ? "0" + g : g) +
        (b.length === 1 ? "0" + b : b)
    );
}