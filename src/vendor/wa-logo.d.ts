interface LogoController {
  play(): void;
  pause(): void;
  resume(): void;
  seek(seconds: number): void;
  destroy(): void;
  readonly duration: number;
  readonly element: SVGSVGElement;
}
export function mountWALogo(
  host: HTMLElement,
  source: string,
  options?: {
    color?: string;
    width?: string | number;
    autoplay?: boolean;
    respectReducedMotion?: boolean;
  },
): LogoController;
