# GitHub publication scope

The complete standalone website is published in the `main` branch of `dHaRuNms/barak-bms-cinematic`. The existing `gh-pages` branch receives only the reviewed `dist/` files and `.nojekyll`.

The source snapshot includes the original GLBs, rendered films, frame stills, model/render scripts, timeline, working dashboard, build configuration and requirements. Large archived concept-image PNGs, node_modules, frame caches, local review evidence and unrelated workspace documents are excluded. Earlier raster prompts remain documented for provenance; the shipping story images are frames from the rendered film.

To deploy future changes, build with the real `SITE_URL`, then publish the contents of `dist/` to `gh-pages`. Keep the source branch separately so generated output does not replace the editable project. No credentials are stored in this project.
