function getProgressbar(current, max) {
    if (max ===0) max = 1
    const percent = current / max
    let progressbar = "["
    let full = Math.round(current / max * 20)
    for (let i = 0; i < 20; i++) {
        if (full !== 0) {
            progressbar += "█"
            full--
        } else {
            progressbar += "░"
        }
    }
    progressbar += `] ${Math.round(percent * 100)}%`
    return progressbar
}


module.exports = getProgressbar