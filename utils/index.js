export const isTradeTime = () => {
    const dayjs = useDayjs()
    const d = dayjs().day()
    if (d < 1 || d> 6) return false
    const h = dayjs().hour()
    const m = dayjs().minute()
    if ((h <= 8 && m < 45) || h>=15) return false
    return true
}