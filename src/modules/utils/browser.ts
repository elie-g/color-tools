// var orientation = (screen.orientation || {}).type || screen.mozOrientation || screen.msOrientation;
//
// if (orientation === "landscape-primary") {
//   console.log("That looks good.");
// } else if (orientation === "landscape-secondary") {
//   console.log("Mmmh... the screen is upside down!");
// } else if (orientation === "portrait-secondary" || orientation === "portrait-primary") {
//   console.log("Mmmh... you should rotate your device to landscape");
// } else if (orientation === undefined) {
//   console.log("The orientation API isn't supported in this browser :(");
// }

type OrientationType =
  'portrait-primary' | 'portrait-secondary' |
  'landscape-primary' | 'landscape-secondary'

export interface IOrientation {
  readonly orientation: OrientationType
  
  isPortrait(): boolean
  isLandscape(): boolean
  
  isPrimary(): boolean
  isSecondary(): boolean
  
  toString(): string
  toJSON(): any
  
  equals(o: IOrientation | OrientationType): boolean
}

abstract class BaseOrientation implements IOrientation {
  abstract readonly orientation: OrientationType
  
  isPortrait(): boolean { return this.orientation.startsWith('portrait') }
  
  isLandscape(): boolean { return this.orientation.startsWith('landscape') }
  
  isPrimary(): boolean { return this.orientation.endsWith('primary') }
  
  isSecondary(): boolean { return this.orientation.endsWith('secondary') }
  
  toString(): string { return String(this.orientation) }
  
  toJSON(): any { return this.orientation }
  
  equals(o: IOrientation | OrientationType): boolean {
    if (o && typeof o == 'object')
      o = o.orientation
    return this.orientation == o
  }
  
}

export class Orientation extends BaseOrientation implements IOrientation {
  readonly orientation: OrientationType
  
  constructor(orientation: OrientationType) {
    super()
    this.orientation = orientation ?? undefined
  }
}


export interface IBrowserOrientation extends IOrientation {
  addListener(listener: EventListener): void
  removeListener(listener: EventListener): void
}

class BrowserOrientation extends BaseOrientation implements IBrowserOrientation {
  static _instance: BrowserOrientation
  private _resizeListenerMap: Map<EventListener, EventListener>
  
  private constructor() {
    super()
    this._resizeListenerMap = new Map()
  }
  
  static get instance(): BrowserOrientation {
    if (this._instance == null)
      this._instance = new BrowserOrientation()
    return this._instance
  }
  
  get orientation(): OrientationType {
    let orient: OrientationType
    
    if (screen.orientation != null) {
      orient = screen.orientation.type
    } else {
      switch (window.orientation) {
        case 0:
          orient = 'portrait-primary'
          break
        case 180:
          orient = 'portrait-secondary'
          break
        case 90:
          orient = 'landscape-primary'
          break
        case -90:
          orient = 'landscape-secondary'
          break
        default:
          orient = screen.width > screen.height
            ? 'landscape-primary'
            : 'portrait-primary'
      }
    }
    
    return orient
  }
  
  removeListener(listener: EventListener): void {
    if (screen.orientation != null) {
      screen.orientation.removeEventListener('change', listener)
    } else if (this._resizeListenerMap.has(listener)) {
      window.removeEventListener('resize', <any> this._resizeListenerMap.get(listener))
    }
  }
  
  addListener(listener: EventListener): void {
    if (screen.orientation != null) {
      screen.orientation.addEventListener('change', listener)
    } else {
      const resizeListener = this._createResizeListener(listener)
      window.addEventListener('resize', resizeListener);
      this._resizeListenerMap.set(listener, resizeListener)
    }
  }
  
  private _createResizeListener(listener: EventListener): EventListener {
    let prevOrientation = this.orientation
    return (ev: Event) => {
      let currentOrientation = this.orientation
      if (prevOrientation != currentOrientation) {
        prevOrientation = currentOrientation
        listener(ev)
      }
    }
  }
}

export const orientation: IBrowserOrientation = BrowserOrientation.instance

export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}
