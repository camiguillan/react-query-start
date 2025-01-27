
const path = 'https://cautious-halibut-r69xr5795762w759-3000.app.github.dev/'

export async function fetchEvents() {
    const response = await fetch(path + 'events');

    if (!response.ok) {
      const error = new Error('An error occurred while fetching the events');
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }

    const { events } = await response.json();

    return events;
}