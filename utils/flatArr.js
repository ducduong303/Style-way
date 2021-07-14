function flatArr(arr) {
    return arr.reduce((pre, cur) => {
        return pre.concat(Array.isArray(cur) ? flatArr(cur) : cur)
    }, [])
}

module.exports = flatArr