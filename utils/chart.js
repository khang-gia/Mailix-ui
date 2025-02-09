import { CrosshairMode } from 'lightweight-charts'

export const getChartTheme = () => {
  const colorMode = useColorMode()
  return colorMode.value === 'light' ? {
    layout: {
      background: {
        type: 'solid',
        color: '#FFFFFF',
      },
      textColor: '#191919'
    },
    grid: {
      horzLines: {
        color: '#F0F3FA',
      },
      vertLines: {
        color: '#F0F3FA',
      },
    },
  } : {
    layout: {
      background: {
        type: 'solid',
        color: '#232732',
      },
      textColor: '#aeafb1',
    },
    grid: {
      horzLines: {
        color: '#F0F3FA11',
      },
      vertLines: {
        color: '#F0F3FA11',
      },
    },
  }    
}

export const getChartBaseOption = () => {
  return {
    rightPriceScale: {
      visible: true,
    },
    leftPriceScale: {
      visible: false,
    },
    crosshair: {
      mode: CrosshairMode.Normal,  
      vertLine: {
        width: 2,
        color: '#C3BCDB44',
        labelBackgroundColor: '#9B7DFF',
      },
      horzLine: {
        color: '#9B7DFF',
        labelBackgroundColor: '#9B7DFF',
  
      },
    },
    layout: {
      background: {
        type: 'solid',
        color: '#232732',
      },
      textColor: '#aeafb1',
    },
    grid: {
      horzLines: {
        color: '#F0F3FA11',
      },
      vertLines: {
        color: '#F0F3FA11',
      },
    },
    timeScale: {
      borderColor: '#6a6e74',
      timeVisible: true,
      secondsVisible: true,
      fixLeftEdge: true,
      fixRightEdge: true,
      barSpacing: 0.18,
      minBarSpacing: 0.18
    },
    handleScroll: {
      vertTouchDrag: false,
      mouseWheel: false,
    },
    handleScale: {
      mouseWheel: false
    }
  }
}