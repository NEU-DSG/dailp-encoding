//! Small `roxmltree` tree-walking helpers shared by `tei_import.rs` and `mets_import.rs`.
//! Both modules match elements by local name only, ignoring namespace -- every element
//! type in these bundles (METS's `mets:` prefix, TEI's default namespace, `d:noteBlock`)
//! has a locally-unique tag name, so there's never a real ambiguity to resolve, and
//! matching on the full `(namespace, name)` pair everywhere would just be noise.

use roxmltree::Node;

/// The namespace `xml:id`/`xml:lang` resolve to -- built into every XML parser, not
/// declared explicitly in any of these templates.
pub(crate) const XML_NAMESPACE: &str = "http://www.w3.org/XML/1998/namespace";

/// First descendant-or-self element with local name `name`.
pub(crate) fn descendant<'a, 'input>(
    node: Node<'a, 'input>,
    name: &str,
) -> Option<Node<'a, 'input>> {
    node.descendants()
        .find(|d| d.is_element() && d.tag_name().name() == name)
}

/// Every descendant-or-self element with local name `name`, in document order.
pub(crate) fn descendants_named<'a, 'input: 'a>(
    node: Node<'a, 'input>,
    name: &'a str,
) -> impl Iterator<Item = Node<'a, 'input>> {
    node.descendants()
        .filter(move |d| d.is_element() && d.tag_name().name() == name)
}

/// Every direct child element with local name `name`, in document order.
pub(crate) fn children_named<'a, 'input: 'a>(
    node: Node<'a, 'input>,
    name: &'a str,
) -> impl Iterator<Item = Node<'a, 'input>> {
    node.children()
        .filter(move |d| d.is_element() && d.tag_name().name() == name)
}

/// Concatenates every text-node descendant of `node`, trimmed. Works both for
/// pure-text leaf elements and for elements that mix text with an empty sibling
/// element (e.g. a bare TEI `<w>` with a preceding `<ptr/>`), since an empty element
/// never contributes any text of its own.
pub(crate) fn text_content(node: Node) -> String {
    node.descendants()
        .filter(|d| d.is_text())
        .filter_map(|d| d.text())
        .collect::<String>()
        .trim()
        .to_owned()
}
