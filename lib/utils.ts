export function cx(...classes: Array<string | false | undefined>) {
    return classes.filter(Boolean).join(' ');
    }
    
    
export function formatDate(dateStr?: string) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }

export function formatDateTime(dateStr?: string) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
    }
    
    
    export function estReadTimeFromHTML(html?: string) {
    if (!html) return 4;
    const text = html.replace(/<[^>]+>/g, ' ');
    const words = text.trim().split(/\s+/).length;
    return Math.max(3, Math.round(words / 225));
    }
