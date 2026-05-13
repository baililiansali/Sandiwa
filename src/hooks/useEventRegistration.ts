import { useState, useEffect } from "react";

export interface RegisteredEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  price: number;
  registeredAt: string;
  status: string;
}

export function useEventRegistration() {
  const [registeredEvents, setRegisteredEvents] = useState<RegisteredEvent[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("sandiwa.registeredEvents");
    if (stored) {
      setRegisteredEvents(JSON.parse(stored));
    }
  }, []);

  const isRegistered = (eventId: string): boolean => {
    return registeredEvents.some(e => e.id === eventId);
  };

  const getRegisteredEvent = (eventId: string): RegisteredEvent | undefined => {
    return registeredEvents.find(e => e.id === eventId);
  };

  const getAllRegisteredEvents = (): RegisteredEvent[] => {
    return registeredEvents;
  };

  return {
    isRegistered,
    getRegisteredEvent,
    getAllRegisteredEvents,
    registeredEvents,
  };
}