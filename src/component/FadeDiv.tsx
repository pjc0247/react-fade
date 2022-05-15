import React, {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom";
import styled, { css } from "styled-components";

enum DisplayStatus {
  FadeIn = 1,
  Show = 2,
  FadeOut = 3,
  Hidden = 0,
}

export const useTransitionalState = (
  initialValue: boolean,
  initialDisplayStatus?: DisplayStatus
): [DisplayStatus, (newValue: boolean) => void] => {
  const [show, setShow] = useState(initialValue);
  const [displayStatus, setDisplayStatus] = useState(
    initialDisplayStatus ?? DisplayStatus.FadeIn
  );

  useEffect(() => {
    if (show) {
      if (displayStatus !== DisplayStatus.Show) {
        setDisplayStatus(DisplayStatus.FadeIn);
        setTimeout(() => {
          setDisplayStatus(DisplayStatus.Show);
        }, 1);
      }
    } else {
      setDisplayStatus(DisplayStatus.FadeOut);
      setTimeout(() => {
        setDisplayStatus(DisplayStatus.Hidden);
      }, 500);
    }
  }, [show]);

  return [displayStatus, setShow];
};

interface TransitionalDivProps {
  show: DisplayStatus;
  children: React.ReactNode;
}
export const TransitionalDiv = forwardRef<HTMLDivElement, TransitionalDivProps>(
  ({ show, children, ...props }: TransitionalDivProps, ref) => {
    if (!show) return null;
    return (
      <Wrapper ref={ref} show={show} {...props}>
        {children}
      </Wrapper>
    );
  }
);

interface FadeDivProps {
  children: React.ReactNode;
}
export const FadeDiv = ({ children, ...props }: FadeDivProps) => {
  const [show, setShow] = useTransitionalState(true);
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    return () => {
      const elem = document.createElement("div");
      const parent = ref.current?.parentElement;
      const sibIndex = Array.from(parent!.children).indexOf(ref.current!);
      const f = parent!.children[sibIndex + 1];

      queueMicrotask(() => {
        setShow(false);
        parent!.insertBefore(elem, f);

        ReactDOM.render(<FadeOutDiv ref={ref}>{children}</FadeOutDiv>, elem);
      });
    };
  }, []);

  return (
    <TransitionalDiv ref={ref} show={show} {...props}>
      {children}
    </TransitionalDiv>
  );
};

const FadeOutDiv = ({ children }: any) => {
  const [show, setShow] = useTransitionalState(true, DisplayStatus.Show);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShow(false);
  }, []);

  return (
    <TransitionalDiv ref={ref} show={show}>
      {children}
    </TransitionalDiv>
  );
};

const Wrapper = styled.div<{ show: DisplayStatus }>`
  transition: all 0.5s ease;
  transform-origin: top center;

  ${({ show }) =>
    ({
      [DisplayStatus.FadeIn]: css`
        opacity: 0;
        transform: scaleY(0);
        margin-top: -24px;
      `,
      [DisplayStatus.Show]: css`
        opacity: 1;
      `,
      [DisplayStatus.FadeOut]: css`
        opacity: 0;
        transform: scaleY(0);
        margin-top: -24px;
      `,
      [DisplayStatus.Hidden]: css``,
    }[show])}
`;
