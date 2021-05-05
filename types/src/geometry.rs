/// A rectangle slice of something, usually a large document image.
///
/// Units are a percentage of the containing document.
/// This is more useful than pixels because we can more easily compare
/// geometries between images of different resolutions. For example, we could identify
/// all items in any bottom-right corner with Geometry(90%, 90%, 100%, 100%).
/// Physical units would be better, but IIIF only allows pixels and percentages.
///
/// Potential use case:
/// Each document is represented by an ordered list of [AnnotatedForm]s. Each
/// form has some geometry on the source image. There are a bunch of other
/// annotations on the source image that are unordered. These may be specific
/// syllabary characters, notes about the handwriting, etc. Using MongoDB
/// comparison queries, we can request a list of all spatial annotations
/// on the same document that lie within or around the geometry of this specific word.
#[derive(Clone, Debug, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct Geometry {
    x_min: Scalar,
    y_min: Scalar,
    x_max: Scalar,
    y_max: Scalar,
}

type Scalar = f64;
impl Geometry {
    pub fn new(x_min: Scalar, y_min: Scalar, x_max: Scalar, y_max: Scalar) -> Self {
        Self {
            x_min,
            y_min,
            x_max,
            y_max,
        }
    }
    pub fn to_iiif_string(&self) -> String {
        let w = self.x_max - self.x_min;
        let h = self.y_max - self.y_min;
        format!("pct:{},{},{},{}", self.x_min, self.y_min, w, h)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn iiif_string() {
        let g = Geometry::new(90.0, 91.0, 100.0, 99.0);
        let s = g.to_iiif_string();
        assert_eq!(s, "pct:90,91,10,8");
    }
}
