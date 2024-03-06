/**
* @typedef File
* @property {String} name The file name to output relative to the root directory
* @property {String|Buffer} content The file content to write
*/

/**
* Generate files when Vite is compiling content
*
* @param {Array<File>} files List of files to inject
* @returns {Promise} A promise which resolves when the operation has completed
*/
export default function vitePluginInject(files) {
	return {
		name: 'vite-plugin-output',
		buildEnd() {
			return Promise.all(files
				.map((file, fileNumber) => {
					if (typeof file != 'object') throw new Error(`Expected object #${fileNumber} in vite-plugin-inject return`);
					if (!file.name || !file.content) throw new Error(`Expected vite-plugin-inject entry #${fileNumber} to have a "name" + "content" object keys`);

					return Promise.resolve( // Resolve content
						typeof file.content == 'function'
							? file.content.call(file, file)
							: file.content
					)
					.then(content => {
						if (Array.isArray(content)) {
							content = content.join('\n'); // Splat array output into String
						} else if (typeof content != 'string' || content instanceof Buffer) {
							throw new Error(`Unknown output type for injected file "${file.name}" - need an Array<String>, String or Buffer`);
						}

						return this.emitFile({
							type: 'asset',
							fileName: file.name,
							source: content,
						});
					})
				})
			)
		},
	}
}
