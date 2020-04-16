module.exports = {
	path: "/api",
	aliases: {
		"POST /upload/file"(req, response) {
			const form = new multiparty.Form();
			const ref = this;
			form.parse(req, function (err, fields, files) {
				const file = files.file[0];
				return ref.broker
					.call("amazon.uploadFile", { file })
					.then((res) => {
						ref.logger.info("File uploaded successfully!", res);
						response.end(res);
					})
					.catch((err) => {
						ref.logger.error("File upload error!", err);
						ref.sendError(req, res, err);
					});
			});
		},
	},

	actions: {
		uploadFile(ctx) {
			const { params } = ctx;
			const { file } = params;
			return this.uploadToS3({ userId: "knx33146", file });
		},
	},

	methods: {
		uploadToS3({ userId, file }) {
			const buffer = fs.readFileSync(file.path);
			const key = `test-amazon-service/${file.originalFilename}`;

			const params = {
				Bucket: awsConfig.bucket,
				Key: key,
				Body: buffer,
			};

			return new Promise(function (resolve, reject) {
				s3.createBucket(function () {
					s3.upload(params, function (err, data) {
						if (err) {
							console.log("error in callback");
							console.log(err);
						}
						resolve(JSON.stringify(data));
					});
				});
			});
		},
	},
};
