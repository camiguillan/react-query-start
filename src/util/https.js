import { QueryClient } from "@tanstack/react-query";


const path = 'https://cautious-halibut-r69xr5795762w759-3000.app.github.dev/'
export const queryClient = new QueryClient()

export async function fetchEvents({ signal, searchTerm }) {
  console.log(searchTerm);
  let url = path + 'events';

  if (searchTerm) {
    url += '?search=' + searchTerm;
  }

  const response = await fetch(url, { signal: signal });

  if (!response.ok) {
    const error = new Error('An error occurred while fetching the events');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { events } = await response.json();

  return events;
}


export async function createNewEvent(eventData) {
  const createPath = path + 'events'
  const response = await fetch(createPath, {
    method: 'POST',
    body: JSON.stringify(eventData),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = new Error('An error occurred while creating the event');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { event } = await response.json();

  return event;
}


export async function fetchSelectableImages({ signal }) {
  const response = await fetch(path + 'images', { signal });

  if (!response.ok) {
    const error = new Error('An error occurred while fetching the images');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { images } = await response.json();

  return images;
}


export async function fetchEvent({ id, signal }) {
  const response = await fetch(path + `events/${id}`, { signal });

  if (!response.ok) {
    const error = new Error('An error occurred while fetching the event');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { event } = await response.json();

  return event;
}


export async function deleteEvent({ id }) {
  const response = await fetch(path + `events/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = new Error('An error occurred while deleting the event');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return response.json();
}