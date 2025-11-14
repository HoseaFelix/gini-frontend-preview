interface ButtonProps {
    href: string,
    title: string,
    containerClass: string,
    
}

interface ActionButtons extends ButtonProps {
    onclick: ()=> void;
}

type DescriptionProps = {
    header: String
    subtext: string
}

type testimonialArray = {
    imageUrl: string
    name: string
    workPosition: string
    state: string
    topic: string
    subText: string
}

type authType = 'login' | 'signup'| 'reset-password'

declare module 'html2pdf.js';

type chatMessage = {
    role: 'user' | 'assistant';
    message: string
}


