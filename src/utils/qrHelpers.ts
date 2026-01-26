export const QRHelpers = {
    generateWifiString: (ssid: string, password?: string, type: string = 'WPA') => {
        // Format: WIFI:T:WPA;S:mynetwork;P:mypass;;
        return `WIFI:T:${type};S:${ssid};P:${password || ''};;`;
    },

    generateEmailString: (email: string, subject?: string, body?: string) => {
        // Format: mailto:name@example.com?subject=...&body=...
        let str = `mailto:${email}`;
        const params = [];
        if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
        if (body) params.push(`body=${encodeURIComponent(body)}`);

        if (params.length > 0) {
            str += `?${params.join('&')}`;
        }
        return str;
    },

    generateSmsString: (phone: string, message?: string) => {
        // Format: smsto:number:message
        return `smsto:${phone}:${message || ''}`;
    },

    generateTelString: (phone: string) => {
        return `tel:${phone}`;
    },

    generateVCardString: (name: string, phone?: string, email?: string, org?: string) => {
        return `BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL:${phone || ''}
EMAIL:${email || ''}
ORG:${org || ''}
END:VCARD`;
    }
};
