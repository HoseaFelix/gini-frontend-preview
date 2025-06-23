interface ButtonProps {
    href: string,
    title: string,
    containerClass: string
}

interface ActionButtons extends ButtonProps {
    onclick: ()=> void;
}