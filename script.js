(() => {
  const form = document.querySelector('#feedback-form');
  const message = document.querySelector('#form-message');
  const textarea = form.elements.message;
  const count = document.querySelector('#char-count');
  const STORAGE_KEY = 'campus-voice-feedback-v1';

  document.querySelector('#year').textContent = new Date().getFullYear();
  textarea.addEventListener('input', () => { count.textContent = textarea.value.length; });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    message.className = 'form-message';
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const entry = {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      name: data.get('name').trim(),
      email: data.get('email').trim(),
      department: data.get('department'),
      category: data.get('category'),
      rating: Number(data.get('rating')),
      message: data.get('message').trim(),
      followup: data.has('followup'),
      submittedAt: new Date().toISOString()
    };

    try {
      const entries = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      entries.push(entry);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      form.reset();
      count.textContent = '0';
      message.textContent = 'Thank you for sharing your perspective. Your feedback has been saved on this device.';
      message.classList.add('success');
    } catch {
      message.textContent = 'We couldn’t save your feedback in this browser. Please check your storage settings and try again.';
      message.classList.add('error');
    }
  });
})();
