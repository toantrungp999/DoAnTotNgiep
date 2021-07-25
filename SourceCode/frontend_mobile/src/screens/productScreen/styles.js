import {StyleSheet, Dimensions} from 'react-native';

const {width: viewportWidth} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#F1F2F6',
    flex: 1,
  },
  carouselContainer: {
    minHeight: 250,
  },
  carousel: {},

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageContainer: {
    justifyContent: 'center',
    width: 0.96 * viewportWidth,
    height: 1.2 * viewportWidth,
    marginLeft: 0.02 * viewportWidth,
    marginTop: 0.02 * viewportWidth,
  },
  textColor: {
    position: 'absolute',
    top: 5,
    left: 5,
    paddingTop: 5,
    paddingBottom: 7,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 18,
    color: '#ffffff',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 5,
  },
  paginationContainer: {
    flex: 1,
    position: 'absolute',
    alignSelf: 'center',
    paddingVertical: 8,
    marginTop: 1.1 * viewportWidth,
  },
  paginationDot: {
    width: 12,
    height: 12,
    borderRadius: 30,
    marginHorizontal: 0,
    borderColor: '#ffffff',
    borderWidth: 2,
  },
  infoRecipeContainer: {
    flex: 1,
    margin: 10,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  infoPhoto: {
    height: 20,
    width: 20,
    marginRight: 0,
  },
  infoRecipe: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  category: {
    fontSize: 14,
    fontWeight: 'bold',
    margin: 10,
    color: '#2cd18a',
  },
  infoDescriptionRecipe: {
    textAlign: 'left',
    fontSize: 16,
    marginTop: 30,
    margin: 15,
  },
  infoRecipeName: {
    fontSize: 18,
    margin: 5,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
});

export default styles;
