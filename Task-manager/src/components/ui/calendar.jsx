
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { Box, IconButton, styled } from "@mui/material";

const CalendarWrapper = styled(Box)({
  padding: '0.75rem',
});

const MonthsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  '@media (min-width: 640px)': {
    flexDirection: 'row',
    '& > *:not(:first-of-type)': {
      marginLeft: '1rem',
    },
  },
  marginBottom: '1rem',
}));

const MonthContainer = styled(Box)({
  marginBottom: '1rem',
});

const CaptionContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  position: 'relative',
  alignItems: 'center',
  padding: '0.25rem 0',
});

const CaptionLabel = styled('div')({
  fontSize: '0.875rem',
  fontWeight: 500,
});

const NavContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  '& > *:not(:first-of-type)': {
    marginLeft: '0.25rem',
  },
});

const NavButton = styled(IconButton)({
  height: '1.75rem',
  width: '1.75rem',
  padding: 0,
  backgroundColor: 'transparent',
  opacity: 0.5,
  '&:hover': {
    opacity: 1,
  },
});

const PreviousButton = styled(NavButton)({
  position: 'absolute',
  left: '0.25rem',
});

const NextButton = styled(NavButton)({
  position: 'absolute',
  right: '0.25rem',
});

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={className}
      classNames={{
        months: MonthsContainer,
        month: MonthContainer,
        caption: CaptionContainer,
        caption_label: CaptionLabel,
        nav: NavContainer,
        nav_button: NavButton,
        nav_button_previous: PreviousButton,
        nav_button_next: NextButton,
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft style={{ width: '1rem', height: '1rem' }} />,
        IconRight: () => <ChevronRight style={{ width: '1rem', height: '1rem' }} />,
      }}
      {...props}
    />
  );
}

export { Calendar };
