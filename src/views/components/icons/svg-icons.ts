const req = require.context('../../../assets/icons/svg', false, /\.svg$/)

const re = /\.\/(.*)\.svg/

const svgIcons = req.keys().map(i => {
    let matchs = i.match(re)
    if (matchs)
    {
        return matchs[1]
    }
})

export default svgIcons
