import { extendTheme } from "@chakra-ui/react"

export default extendTheme({
    fonts: {
        azonix: "Azonix",
        heading: "Poppins",
        subheading: "Red Hat Display",
        body: "Product Sans",
    },
    colors: {
        brand: {
            gradient: "linear-gradient(90deg, #95E1FF -6.6%, #E7B0FF 48.04%, #FBD197 94.7%)",
            black: "#424242",
            black600: "#161E3D",
            black400: "#4E546B",
            peach: "#E886A4",
            green: "#8CE08A",
            purple: "#C993FF"
        }
    },
})