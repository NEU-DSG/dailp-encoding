import React from "react"

export const AnnotatedElement = (props: { element: any }) => {
    // Render each of our TEI elements differently.
    switch (props.element.name) {
        case "ab":
            return (
                <div style={{ display: "flex", flexFlow: "row wrap" }}>
                    {props.element.children.map(e => (
                        <AnnotatedElement key={e.attributes["xml:id"]} element={e} />
                    ))}
                </div>
            )
        case "phr":
        case "seg":
            return props.element.children.map(e => (
                <AnnotatedElement key={e.attributes["xml:id"]} element={e} />
            ))
        case "pb":
            return <PageBreak />
        case "w":
            return <AnnotatedWord elem={props.element} />
        case "lb":
            return <div style={{ flexBasis: "100%" }} />
        default:
            return null
    }
}


const PageBreak = () => (
    <div style={{ margin: 50 }}>Page Start</div>
)
const AnnotatedWord = (props: { elem: any }) => {
    const choice = props.elem.children[0]
    const layers = choice.children
    return <div style={{ marginBottom: 50, marginRight: 50 }}>
        {layers.map(layer => (<div>{layer.content}</div>))}
    </div>
}
