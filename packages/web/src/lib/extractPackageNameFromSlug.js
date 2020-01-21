export default function extractPackageNameFromSlug(packageSlug) {
  const newSlug = packageSlug

  const slugArray = newSlug.split('/')

  return slugArray[slugArray.length - 1]
}
