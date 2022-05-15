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
  className?: string;
  children: React.ReactNode;
}
export const TransitionalDiv = forwardRef<HTMLDivElement, TransitionalDivProps>(
  ({ show, children, className, ...props }: TransitionalDivProps, ref) => {
    if (!show) return null;

    const newClassName = [
      {
        [DisplayStatus.FadeIn]: "fadeIn",
        [DisplayStatus.FadeOut]: "fadeOut",
        [DisplayStatus.Show]: "",
        [DisplayStatus.Hidden]: "",
      }[show],
      className,
    ].join(" ");

    return (
      <Wrapper ref={ref} className={newClassName} {...props}>
        {children}
      </Wrapper>
    );
  }
);

interface FadeDivProps {
  children: React.ReactNode;
}
export const FadeDiv = ({ children, ...props }: FadeDivProps) => {
  const [show] = useTransitionalState(true);
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    return () => {
      const elem = document.createElement("div");
      const parent = ref.current?.parentElement;
      const sibIndex = Array.from(parent!.children).indexOf(ref.current!);
      const f = parent!.children[sibIndex + 1];

      queueMicrotask(() => {
        parent!.insertBefore(elem, f);

        ReactDOM.render(
          <FadeOutDiv ref={ref} {...props}>
            {children}
          </FadeOutDiv>,
          elem
        );
      });
    };
  }, []);

  return (
    <TransitionalDiv ref={ref} show={show} {...props}>
      {children}
    </TransitionalDiv>
  );
};

const FadeOutDiv = ({ children, ...props }: any) => {
  const [show, setShow] = useTransitionalState(true, DisplayStatus.Show);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShow(false);
  }, []);

  return (
    <TransitionalDiv ref={ref} show={show} {...props}>
      {children}
    </TransitionalDiv>
  );
};

const Wrapper = styled.div``;
