/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";

interface UseYjsEditorOptions {
  roomId: string;
}

interface UseYjsEditorReturn {
  ydoc: any;
  provider: any;
  binding: any;
  isYjsConnected: boolean;
  editor: any;
  setEditor: React.Dispatch<React.SetStateAction<any>>;
}

export function useYjsEditor({ roomId }: UseYjsEditorOptions): UseYjsEditorReturn {
  const [editor, setEditor] = useState<any>(null);
  const [isYjsConnected, setIsYjsConnected] = useState(false);
  
  // Use refs to store instances that need to persist across renders
  const ydocRef = useRef<any>(null);
  const providerRef = useRef<any>(null);
  const bindingRef = useRef<any>(null);
  const isInitializedRef = useRef(false);

  // Initialize Yjs document and provider
  useEffect(() => {
    if (typeof window === "undefined" || !roomId || isInitializedRef.current) return;
    
    let isMounted = true;
    
    const init = async () => {
      const Y = await import("yjs");
      const { WebsocketProvider } = await import("y-websocket");
      
      if (!isMounted) return;
      
      // Create Y.Doc
      const doc = new Y.Doc();
      ydocRef.current = doc;
      
      // Create WebSocket provider
      const wsProvider = new WebsocketProvider(
        "ws://localhost:8000",
        `yjs-${roomId}`,
        doc,
        { connect: true }
      );
      
      wsProvider.on("status", (event: any) => {
        console.log("Yjs status:", event.status);
        if (isMounted) setIsYjsConnected(event.status === "connected");
      });

      wsProvider.on("connection-close", () => {
        console.log("Yjs connection closed");
        if (isMounted) setIsYjsConnected(false);
      });

      wsProvider.on("sync", (isSynced: boolean) => {
        console.log("Yjs synced:", isSynced);
      });

      providerRef.current = wsProvider;
      isInitializedRef.current = true;
      
      // Force re-render to trigger binding setup
      if (isMounted) setIsYjsConnected(wsProvider.wsconnected);
    };
    
    init();

    return () => {
      isMounted = false;
    };
  }, [roomId]);

  // Setup Monaco binding when editor becomes available
  useEffect(() => {
    if (typeof window === "undefined" || !editor || !ydocRef.current || !providerRef.current) {
      return;
    }

    let isMounted = true;
    
    const setupBinding = async () => {
      const { MonacoBinding } = await import("y-monaco");
      
      if (!isMounted || !ydocRef.current || !providerRef.current) return;
      
      console.log("Setting up Monaco binding...");

      const ytext = ydocRef.current.getText("monaco");
      const model = editor.getModel();

      if (!model) {
        console.error("Monaco model not available");
        return;
      }

      // Destroy existing binding if any
      if (bindingRef.current) {
        bindingRef.current.destroy();
      }

      const monacoBinding = new MonacoBinding(
        ytext,
        model,
        new Set([editor]),
        providerRef.current.awareness
      );

      bindingRef.current = monacoBinding;

      if (ytext.length === 0) {
        ytext.insert(0, "// Start coding...");
      }
    };
    
    setupBinding();

    return () => {
      isMounted = false;
    };
  }, [editor, isYjsConnected]); // Re-run when editor changes or connection status changes

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      bindingRef.current?.destroy();
      providerRef.current?.destroy();
      ydocRef.current?.destroy();
      isInitializedRef.current = false;
    };
  }, []);

  return {
    ydoc: ydocRef.current,
    provider: providerRef.current,
    binding: bindingRef.current,
    isYjsConnected,
    editor,
    setEditor,
  };
}
