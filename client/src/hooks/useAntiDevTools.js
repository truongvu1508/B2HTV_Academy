// useAntiDevTools.js
import { useEffect } from "react";

export function useAntiDevTools() {
  useEffect(() => {
    // Chặn F12
    const handleKeyDown = (e) => {
      // Chặn F12
      if (e.key === "F12" || e.keyCode === 123) {
        e.preventDefault();
        return false;
      }

      // Chặn Ctrl+Shift+I / Cmd+Option+I
      if (
        (e.ctrlKey && e.shiftKey && e.keyCode === 73) ||
        (e.metaKey && e.altKey && e.keyCode === 73)
      ) {
        e.preventDefault();
        return false;
      }

      // Chặn Ctrl+Shift+J / Cmd+Option+J
      if (
        (e.ctrlKey && e.shiftKey && e.keyCode === 74) ||
        (e.metaKey && e.altKey && e.keyCode === 74)
      ) {
        e.preventDefault();
        return false;
      }

      // Chặn Ctrl+Shift+C / Cmd+Option+C
      if (
        (e.ctrlKey && e.shiftKey && e.keyCode === 67) ||
        (e.metaKey && e.altKey && e.keyCode === 67)
      ) {
        e.preventDefault();
        return false;
      }

      // Chặn Ctrl+U / Cmd+U (Xem nguồn)
      if ((e.ctrlKey && e.keyCode === 85) || (e.metaKey && e.keyCode === 85)) {
        e.preventDefault();
        return false;
      }
    };

    // Chặn chuột phải
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Chặn console.log, console.info, etc.
    const disableConsole = () => {
      const noop = () => {};
      const methods = [
        "log",
        "debug",
        "info",
        "warn",
        "error",
        "table",
        "trace",
      ];

      // Lưu trữ các phương thức gốc
      const originalConsole = {};
      methods.forEach((method) => {
        originalConsole[method] = console[method];
        console[method] = noop;
      });

      // Trả về hàm để khôi phục console khi cần
      return () => {
        methods.forEach((method) => {
          console[method] = originalConsole[method];
        });
      };
    };

    // Đăng ký các event listener
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("contextmenu", handleContextMenu);

    // Vô hiệu hóa console
    const restoreConsole = disableConsole();

    // Clear up khi component unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleContextMenu);
      restoreConsole();
    };
  }, []);
}
