import FileSystem from "./FileSystem";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import ModeContext from "../Context/ModeContext";

beforeAll(() => {
  window.electronAPI = {
    saveFile: jest.fn().mockResolvedValue(undefined),
    saveContentToFile: jest.fn().mockResolvedValue(undefined),
    getLatestContentByFile: jest.fn().mockResolvedValue(null),
    getFiles: jest.fn().mockResolvedValue([]),
    deleteFile: jest.fn().mockResolvedValue(undefined),
    transcription: {
      start: jest.fn().mockResolvedValue(undefined),
      stop: jest.fn().mockResolvedValue(undefined),
      onUpdate: jest.fn(),
      removeUpdateListener: jest.fn(),
      getTranscript: jest.fn().mockReturnValue(""),
    },
  };
});

jest.mock("./DailyCalendar", () => {
  const MockedDailyCalendar = (): React.ReactElement | null => (
    <div>Mocked DailyCalendar</div>
  );
  return MockedDailyCalendar;
});

test("Ensures that setting menu can be opened successfully", async () => {
  const editorRef = { current: null };
  const mockSetTheme = jest.fn();

  // Simulate a render
  render(
    <ModeContext.Provider
      value={{ darkTheme: true, setDarkTheme: mockSetTheme }}
    >
      <FileSystem editorRef={editorRef} />
    </ModeContext.Provider>,
  );

  // Simulate a click on the logo
  const logo = await screen.findByTestId("inkFlow-logo");
  await userEvent.click(logo);

  await waitFor(() => {
    expect(screen.getByText("Setting")).toBeInTheDocument();
  });
});
