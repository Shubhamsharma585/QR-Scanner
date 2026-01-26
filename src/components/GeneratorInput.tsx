import React, { useEffect, useState } from 'react';
import { QRHelpers } from '../utils/qrHelpers';
import { Input } from './Input';

interface GeneratorInputProps {
    type: string;
    onChange: (value: string) => void;
}

export const GeneratorInput: React.FC<GeneratorInputProps> = ({ type, onChange }) => {
    // State for different fields
    const [text, setText] = useState('');

    // WiFi
    const [ssid, setSsid] = useState('');
    const [password, setPassword] = useState('');

    // Email
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');

    // Phone
    const [phone, setPhone] = useState('');

    // Update parent when any relevant field changes based on type
    useEffect(() => {
        let result = '';
        switch (type) {
            case 'text':
            case 'url':
                result = text;
                break;
            case 'wifi':
                if (ssid) result = QRHelpers.generateWifiString(ssid, password);
                break;
            case 'email':
                if (email) result = QRHelpers.generateEmailString(email, subject, body);
                break;
            case 'phone':
                if (phone) result = QRHelpers.generateTelString(phone);
                break;
            default:
                result = text;
        }
        onChange(result);
    }, [type, text, ssid, password, email, subject, body, phone]);

    // Reset fields when type changes (optional, but good UX to clear/keep? 
    // Maybe better to keep state separate so switching back preserves it. 
    // I am strictly using separate state variables so they are preserved.)

    switch (type) {
        case 'text':
            return (
                <Input
                    label="Content"
                    placeholder="Enter text here..."
                    value={text}
                    onChangeText={setText}
                    multiline
                    numberOfLines={4}
                    containerStyle={{ height: 120 }}
                    style={{ height: 120, paddingTop: 12 }}
                />
            );
        case 'url':
            return (
                <Input
                    label="Website URL"
                    placeholder="https://example.com"
                    value={text}
                    onChangeText={setText}
                    keyboardType="url"
                    autoCapitalize="none"
                    iconName="link"
                />
            );
        case 'wifi':
            return (
                <>
                    <Input
                        label="Network Name (SSID)"
                        placeholder="WiFi Name"
                        value={ssid}
                        onChangeText={setSsid}
                        iconName="wifi"
                    />
                    <Input
                        label="Password"
                        placeholder="WiFi Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        iconName="lock"
                    />
                </>
            );
        case 'email':
            return (
                <>
                    <Input
                        label="Email Address"
                        placeholder="name@example.com"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        iconName="mail"
                    />
                    <Input
                        label="Subject"
                        placeholder="Email Subject"
                        value={subject}
                        onChangeText={setSubject}
                    />
                    <Input
                        label="Message Body"
                        placeholder="Type your message..."
                        value={body}
                        onChangeText={setBody}
                        multiline
                        numberOfLines={4}
                        containerStyle={{ height: 120 }}
                        style={{ height: 120, paddingTop: 12 }}
                    />
                </>
            );
        case 'phone':
            return (
                <Input
                    label="Phone Number"
                    placeholder="+1 234 567 8900"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    iconName="phone"
                />
            );
        default:
            return null;
    }
};
